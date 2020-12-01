const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  return knex('users').truncate()
    .then(() => {
      return knex('users').insert([
        { username: 'username', password: bcrypt.hashSync('password', 14), first_name: 'user', last_name: 'name' }
      ])
    })
};
