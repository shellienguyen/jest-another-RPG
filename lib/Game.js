const inquirer = require( "inquirer" );
const { prototype } = require("inquirer/lib/objects/choice");
const Enemy = require( "./Enemy" );
const Player = require( "./Player" );

function Game() {
   this.roundNumber = 0;
   this.isPlayerTurn = false;
   this.enemies = [];
   this.currentEnemy;
   this.player;
};

/*
Needs to run immediatelty after the Player or Enemy has taken their turn.
A turn can end in a few ways:
- The Player uses a Potion
- The Player attemps to use a Potion but has an empty inventory
- The Player attacks the Enemy
- The Enemy attacks the Player
*/
Game.prototype.checkEndOfBattle = function() {
   // Should first verify if both characters are alive and can continue fighting.
   //If so, switch the turn order and run battle() again.
   if( this.player.isAlive() && this.currentEnemy.isAlive() ) {
      this.isPlayerTurn = !this.isPlayerTurn;
      this.battle;
   }
   /*
   Player might still be alive but Enemy is defeated.  In this case, the Player
   is awarded a Potion, and the roundNumber increases.  If there are not more enemies
   to fight, the Player has won the overall game.  Otherwise, a new battle should start.
   */
   else if ( this.player.isAlive() && !this.currentEnemy.isAlive() ) {
      console.log( `You've defeated the ${this.currentEnemy.name}`);

      this.player.addPotion( this.currentEnemy.potionDetails );
      console.log( `${this.player.name} found a ${this.currentEnemy.potiion.name} potion`);

      this.roundNumber++;

      if ( this.roundNumber < this.enemies.length ) {
         this.currentEnemy = this.enemies[ this. roundNumber ];
         this.startNewBattle();
      }
      else {
         console.log( "You win!" );
      };
   }
   // The Player might have been defeated, which ends the game
   else {
      console.log( "You've been defeated!" );
   };
};

/* 
Main event of the game; gets run an indefinite # of times
Each time will either be the Player turn or the Enemy turn
If Player turn:
   - Prompt user to attack or use a Potion
   - If using a Potion:
      - Display list of Potion objects to user
      - Apply selected Potion effect to Player
   - If attacking:
      - Subtract health from the Enemy based on Player attack value
If Enemy turn:
   - Subtract health from the Player based on Enemy attack value
*/
Game.prototype.battle = function() {
   if ( this.isPlayerTurn ) {
      inquirer
         .prompt({
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: [ "Attack", "Use potion" ]
         })
         .then(({ action }) => {
            // If user selects "Use potion" it requires a follow-up prompt
            if ( action === "Use potion" ) {
               // If the inventory is empty, return to end the Player turn
               if ( !this.player.getInventory() ) {
                  console.log( "You don't have any potions!" );

                  return this.checkEndOfBattle();
               };

               // If inventory is not empty, prompt user for a specific Potion selection
               inquirer
                  .prompt({
                     type: "list",
                     message: "Which potion would you like to use?",
                     name: "action",
                     /* 
                     The usePotion() method required index of the object in the array
                     Here we populate the choices arry with string that contain the
                     Potion name and its index (e.g., '1: health'), then stirp ou the index
                     after the user has chosen, we do this using the Array.prototype.map() MSInputMethodContext.
                     The map() callback has a 2nd option parameter to capture the index of an item
                     */
                     choices: this.player.getInventory().map(( item, index) => `${index + 1}: ${item.name}`)
                  })
                  /*
                  When the user selects a Potion, the returned valued will be a string like
                  "2: ability".  We sue the String.prototype.split() method to split on the ": "
                  which gives us an array with the number and Potion name (e.g., ['2', 'agility'])
                  Subtracing 1 from the number will put us back at the original array index
                  */
                  .then(({ action }) => {
                     const potionDetails = action.split( ": " );

                     this.player.usePotion( potionDetails[ 0 ] -1 );
                     console.log( `You used a ${potionDetails[ 1 ]} potion`);

                     this.checkEndOfBattle();
                  });
            }
            // If user selects "Attack", redude Enemy health
            else {
               const damage = this.player.getAttackValue();
               this.currentEnemy.reduceHealth( damage );

               console.log( `You attacked the ${this.currentEnemy.name}`);
               console.log( this.currentEnemy.getHealth());

               this.checkEndOfBattle();
            };
         });
   }
   else {
      const damage = this.currentEnemy.getAttackValue();
      this.player.reduceHealth( damage );

      console.log( `You were attacked by the ${this.currentEnemy.name}`);
      console.log( this.player.getHealth() );

      this.checkEndOfBattle();
   };
};

/*
Establish who will take turn first based on agility value
Display the Player object's stats
Display the description of the current Enemy
*/
Game.prototype.startNewBattle = function() {
   // Establish who will take turn first based on agility value
   if ( this.player.agility > this.currentEnemy.agility ) {
      this.isPlayerTurn = true;
   }
   else {
      this.isPlayerTurn = false;
   };

   // Display the Player object's stats and the description of the current Enemy
   console.log( "Your stats are as follows:" );
   console.log( this.player.getStats() );
   console.log( this.currentEnemy.getDescription() );

   this.battle();
};

// Setup Enemy and Player objects
Game.prototype.initializeGame = function() {
   // Populate enemies array
   this.enemies.push( new Enemy( "goblin", "sword" ));
   this.enemies.push( new Enemy( "orc", "baseball bat" ));
   this.enemies.push( new Enemy( "skeleton", "axe" ));

   // Keep track of which Enemy is currently fighting Player
   this.currentEnemy = this.enemies[ 0 ];

   inquirer
      .prompt({
         type: "text",
         name: "name",
         message: "What is your name?"
      })
      // Destructure name from the prompt objext
      .then(({ name }) => {
         this.player = new Player( name );

         // Test the object creation
         //console.log( this.currentEnemy, this.player );

         // Called to kick off first battle and called again anytime a new round starts
         this.startNewBattle();
       });
};

module.exports = Game;