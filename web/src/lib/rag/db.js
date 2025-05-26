import postgres from 'postgres'
import databases from '../../variable/database.json' assert { type: 'json' };

const host = databases[0].host             // Postgres ip address[s] or domain name[s]
const port = databases[0].port                    // Postgres server port[s]
const database = databases[0].database                  // Name of database to connect to
const username = databases[0].username           // Username of database user
const password = databases[0].password    // Password of database user

const sql = postgres(`postgres://${username}:${password}@${host}:${port}/${database}`)

export { sql }
