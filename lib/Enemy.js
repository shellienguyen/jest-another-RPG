const Potion = require( "./Potion" );
const Character = require( "./Character" );

class Enemy extends Character{
   constructor( name, weapon ) {
      // Call parent contructor
      super( name );

      //this.name = name;
      this.weapon = weapon;
      this.potion = new Potion();
   };

   // Returns enemy's description
   getDescription() {
      return `A ${this.name} holding a ${this.weapon} has appeard!`;
   };
};

module.exports = Enemy;