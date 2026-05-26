import config from '../config';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';


const initialAdminUser = {
  email: config?.super_admin_email || 'admin@coreauth.com', // Uses fallback if config email is missing
  password: config?.super_admin_password, // Securely pulled from your environmental variables
  role: USER_ROLE.admin,
  status: 'active',
  isDeleted: false,
};

const seedAdmin = async () => {
  // Check if any admin account already exists in the system
  const isAdminExists = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExists) {
    await User.create(initialAdminUser);
    console.log('📦 Core system administrator account seeded successfully.');
  }
};

export default seedAdmin;

