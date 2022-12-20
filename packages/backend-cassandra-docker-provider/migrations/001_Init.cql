CREATE KEYSPACE IF NOT EXISTS one_game WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };

CREATE TYPE IF NOT EXISTS one_game.card (
  color int,
  kind text,
  number int,
);

CREATE TABLE IF NOT EXISTS one_game.not_started_game (
  id text PRIMARY KEY,
  game_spec tuple <
    text,
    list<
      tuple <
        int,
        frozen< one_game.card >
      >
    >
  >,
  game_slots list < text >
);

CREATE TABLE IF NOT EXISTS one_game.active_game (
  id text PRIMARY KEY,
  current_card frozen< one_game.card >,
  current_color text,
  current_direction text,
  current_playing_slot_index int,
  game_spec tuple <
    text,
    list<
      tuple <
        int,
        frozen< one_game.card >
      >
    >
  >,
  game_slots list <
    tuple <
      text,
      frozen< one_game.card >
    >
  >
);
