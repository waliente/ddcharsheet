var mongoose = require('mongoose');

// ABILITIES SCHEMA

var spellsSchema = new mongoose.Schema({
    name: String,
    level: Number
});

// ABILITIES SCHEMA

var abilitiesSchema = new mongoose.Schema({
    name: String,
    saving: String,
    value: Number,
    proficient: Boolean
});


// WEAPONS SCHEMA

var weaponsSchema = new mongoose.Schema({
    name: String,
    damage: String,
    hit_type: String,
    proficient: Boolean
});

// EQUIPMENT SCHEMA

var equipmentSchema = new mongoose.Schema({
    name: String
});

// TRAITS SCHEMA

var traitsSchema = new mongoose.Schema({
    description: String
});


//  CHARACTER SCHEMA
var CharactersSchema = new mongoose.Schema({
    name: String,
    race: String,
    class: String,
    level: Number,
    deity: String,
    hp: Number,
    hit_dice: String,
    iniziative: Number || null,
    armor: Number,
    speed: Number,
    inspiration: Boolean,
    proficiency: String,
    strength: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    dexterity: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    constitution: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    intelligence: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    wisdom: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    charisma: {
        value: Number || null,
        modifier: Number || null,
        has_save: Boolean,
        save_mod: Number || null
    },
    abilities: [abilitiesSchema],
    weapons: [weaponsSchema],
    equipment: [equipmentSchema],
    traits: [traitsSchema],
    armors_proficiency: String,
    weapons_proficiency: String,
    tools_proficiency: String,
    languages: String,
    spells: [spellsSchema]
});

// USER SCHEMA
var userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    characters: [CharactersSchema]

});

mongoose.model('Users', userSchema);