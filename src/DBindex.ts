require('dotenv').config();
import mysql from 'mysql';
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'life_partner',
  port: 3306,
});

export default db;
