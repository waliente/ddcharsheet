var mongoose = require('mongoose');

// / SKILLS SCHEMA

var strengthSchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});

var dexteritySchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});

var constitutionSchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});

var intelligenceSchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});

var wisdomSchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});

var charismaSchema = new mongoose.Schema({
    value: Number,
    modifier: Number,
    has_save: Boolean,
    save_mod: Number
});


// ABILITIES SCHEMA

var abilitiesSchema = new mongoose.Schema({

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
    inspiration: Boolean,
    proficiency: Boolean,
    strength: strengthSchema,
    dexterity: dexteritySchema,
    constitution: constitutionSchema,
    intelligence: intelligenceSchema,
    wisdom: wisdomSchema,
    charisma: charismaSchema,
    abilities: [abilitiesSchema],
    weapons: [weaponsSchema],
    equipment: [equipmentSchema],
    traits: [traitsSchema],
    armors_proficiency: String,
    weapons_proficiency: String,
    tools_proficiency: String,
    languages: String
});


mongoose.model('Characters', CharactersSchema);