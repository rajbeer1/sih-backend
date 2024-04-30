import { Admin } from "../models/admin";
import { Pass } from "../utils";
export const adminadd = async () => {
  const admins = [{
    'name': 'rajbeer',
    'email':'rajbeer@gmail.com'
  },{'name': 'anupam',
    'email':'anupam@gmail.com'},{'name': 'amit',
      'email': 'amit@gmail.com'
    }];


    const hashedpassword = await Pass.password_crypt('1234');
  admins.map(async(admin) => {
    const insert = new Admin({
      name: admin.name,
      email: admin.email,
      password : hashedpassword
    })

    const saved = await insert.save()

  })
}

export const deleteadmin = async () => {

}