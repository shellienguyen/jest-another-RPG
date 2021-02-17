const Potion = require( "../lib/Potion" );
const Player = require( "../lib/Player" );
jest.mock( "../lib/Potion" );

test( "Creates a player object", () => {
   const player = new Player( "Dave" );

   expect( player.name ).toBe( "Dave" );
   expect( player.health ).toEqual( expect.any( Number ));
   expect( player.strength ).toEqual( expect.any( Number ));
   expect( player.agility ).toEqual( expect.any( Number ));
   expect( player.inventory).toEqual( expect.arrayContaining([ expect.any( Object )]));
});

test( "Gets player's stats as an object", () => {
   const player = new Player( "Dave" );

   expect( player.getStats()).toHaveProperty( "potions" );
   expect( player.getStats()).toHaveProperty( "health" );
   expect( player.getStats()).toHaveProperty( "strength" );
   expect( player.getStats()).toHaveProperty( "agility" );
});

test( "Gets Inventory from players or returns false", () => {
   const player = new Player( "Dave" );
   
   expect( player.getInventory()).toEqual( expect.any( Array ));

   player.inventory = [];

   expect( player.getInventory()).toEqual( false );
});

test( "Gets player's health value", () => {
   const player = new Player( "Dave" );

   expect( player.getHealth()).toEqual( expect.stringContaining( player.health.toString()));
});

test( "Checks if player is alive or not", () => {
   const player = new Player( "Dave" );

   expect( player.isAlive()).toBeTruthy();

   player.health = 0;

   expect( player.isAlive()).toBeFalsy();
});

test( "Subtracts from player's health", () => {
   const player = new Player( "Dave" );
   const oldHealth = player.health;

   player.reduceHealth( 5 );
   expect( player.health ).toBe( oldHealth - 5 );
   player.reduceHealth( 99999 );
   expect( player.health ).toBe( 0 );
});

test( "Gets player's attack value", () => {
   const player = new Player( "Dave" );
   player.strength = 10;

   expect( player.getAttackValue()).toBeGreaterThanOrEqual( 5 );
   expect( player.getAttackValue()).toBeLessThanOrEqual( 15 );
});

test( "Add a potion to the inventory", () => {
   const player = new Player( "Dave" );
   const oldCount = player.inventory.length;

   player.addPotion( new Potion());

   expect( player.inventory.length ).toBeGreaterThan( oldCount );
});

test( "Uses a potion from inventory", () => {
   const player = new Player( "Dave" );
   player.inventory = [ new Potion(), new Potion(), new Potion() ];

   // Keep track of old inventory length to make sure length doesn't go negative
   const oldCount = player.inventory.length;

   player.usePotion( 1 );

   expect( player.inventory.length ).toBeLessThan( oldCount );
});