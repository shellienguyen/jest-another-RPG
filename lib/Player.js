const Potion = require( "../lib/Potion" );
const Character = require( "./Character" );

class Player extends Character {
   constructor( name = "" ) {
      // Call parent contructor
      super( name );
 
      this.inventory = [ new Potion( "health" ), new Potion() ];
   };

   // Returns an object with various player properties
   getStats() {
      return {
         potions: this.inventory.length,
         health: this.health,
         strength: this.strength,
         agility: this.agility
      };
   };

   // Returns the inventory array or false if empty
   getInventory() {
      if ( this.inventory.length ) {
         return this.inventory;
      };
      
      return false;
   };

   // Add potion to the array
   addPotion( potion ) {
      this.inventory.push( potion );
   };

   // .splice() removes items from the arry and returns the remove item(s) as a new array
   // The original inventory array has s single potion removed at the specified index value
   // and put into a new "removed items" array, then the Potion at index[ 0 ] of this
   // "removed items" array is saved in a potion variable.
   usePotion( index ) {
      const potion = this.getInventory().splice( index, 1 )[0];

      switch ( potion.name ) {
         case "agility":
            this.agility += potion.value;
            break;
         case "health":
            this.health += potion.value;
            break;
         case "strength":
            this.strength += potion.value;
            break;
      };
   };
};

module.exports = Player;