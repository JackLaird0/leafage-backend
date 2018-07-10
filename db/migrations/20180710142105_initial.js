
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('zones', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('lowTemp');
      table.string('highTemp');
      
      table.timestamps(true, true);
    }),
    
    knex.schema.createTable('plants', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('scientificName');
      table.string('care');
      table.string('moisture');
      table.string('light');
      table.string('maintenance');
      table.integer('zone_id').unsigned()
      table.foreign('zone_id')
        .references('zones.id');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('plants'),
    knex.schema.dropTable('zones')
  ]);
};
