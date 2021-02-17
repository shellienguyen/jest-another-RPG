const inquirer = require( "inquirer" );
const Enemy = require( "./Enemy" );
const Player = require( "./Player" );

function Game() {
   this.roundNumber = 0;
   this.isPlayerTurn = false;
   this.enemies = [];
   this.currentEnemy;
   this.player;
};

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
      console.log( this.currentEnemy, this.player );

      // This is where we setup Enemy and Player objects
      //Game.prototype.initializeGame = function() {
      //this.startNewBattle();
   });
};

module.exports = Game;