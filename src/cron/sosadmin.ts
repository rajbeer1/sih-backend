import { Admin } from '../models/admin';
import { Datainput } from '../models/data';
import { Sos } from '../models/sos';
import { User } from '../models/user';
import SocketServer from '../socket';
export async function checkSosforadmin() {
  try {
    const admins = await User.find().select(' email admin') 
    const sosesPromises = admins.map(async (admin) => {
      const sos = await Sos.find({ email: admin.email })
        .sort({
          time: -1,
        })
        .limit(1)

      return { email: admin.admin, sos: sos };
    });
    const soses = await Promise.all(sosesPromises);

    const groupedByEmail = splitByEmail(soses);
    const final = consolidateEntries(groupedByEmail)
  
    final.map((entry) => {
      const socket = SocketServer.getInstance()
      
      socket.checksosadmin(entry.email,entry.sos)
    })
  } catch (error) {
    console.error('Failed to check gas levels for all users:', error);
  }
}
function consolidateEntries(groupedEntries) {
  return groupedEntries.map((group) => {

    const email = group[0].email;
    const allSos = group.reduce((acc, current) => {

      return acc.concat(current.sos);
    }, []);

    return { email, sos: allSos }
  });
}

function splitByEmail(entries) {
  const emailMap = {};

  entries.forEach((entry) => {

    if (!emailMap[entry.email]) {
      emailMap[entry.email] = [];
    }
    emailMap[entry.email].push(entry);
  });


  return Object.values(emailMap);
}