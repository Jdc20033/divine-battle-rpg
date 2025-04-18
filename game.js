let player = {
   health: 100,
   maxHealth: 100,
   energy: 100,
   maxEnergy: 100,
   level:  1,
   xp: 0,
   isGeneratingEnergy: false,
   divineProtectionCooldown: 0,
   lordOfTheRealmCooldown: 0,
   divineBarrierTurns: 0,
   realmTurns: 0,
   divineOneBarrier: 0
 };

 let dummy = {
   health: 100,
   energy: 0
 };

 // Inventory & Equipment Setup
 let inventory = Array(10).fill(null);
 let equipment = {
   helmet: null,
   chest: null,
   arms: null,
   legs: null,
   weapon: null
 };

 let playerTurn = true;
 let turnNumber = 1;
 let gameEnded = false;

 document.addEventListener("DOMContentLoaded", () => {
   // Force hide post-battle UI and its buttons on first page load
   document.getElementById("postBattle").style.display = "none";
   document.getElementById("startNewBattleButton").style.display = "none";
   document.getElementById("inventoryButton").style.display = "none";
 });

 // Function to update stats
 function updateStats() {
   document.getElementById("playerHP").textContent = player.health;
   document.getElementById("playerEnergy").textContent = player.energy;
   document.getElementById("dummyHP").textContent = dummy.health;
   document.getElementById("dummyEnergy").textContent = dummy.energy;

   // Update level and XP
   document.getElementById("playerLevel").textContent = player.level;
   document.getElementById("playerXP").textContent = player.xp;
   document.getElementById("xpNeeded").textContent = player.level * 100;

   const xpPercent = (player.xp / (player.level * 100)) * 100;
   document.getElementById("playerXPBar").style.width = `${Math.min(xpPercent, 100)}%`;

   // Health & energy bars
   document.getElementById("playerHealthBar").style.width = (player.health / player.maxHealth) * 100 + "%";
   document.getElementById("playerEnergyBar").style.width = (player.energy / player.maxEnergy) * 100 + "%";
   document.getElementById("dummyHealthBar").style.width = (dummy.health / 100) * 100 + "%";
   document.getElementById("dummyEnergyBar").style.width = (dummy.energy / 100) * 100 + "%";
 }

 // Function to update the bars
 function updateBars() {
   const playerHealthBar = document.getElementById("playerHealthBar");
   const playerHealthPercentage = player.health / player.maxHealth;
   playerHealthBar.style.width = `${Math.min(playerHealthPercentage * 100, 100)}%`;

   const playerEnergyBar = document.getElementById("playerEnergyBar");
   const playerEnergyPercentage = player.energy / player.maxEnergy;
   playerEnergyBar.style.width = `${Math.min(playerEnergyPercentage * 100, 100)}%`;

   const dummyHealthBar = document.getElementById("dummyHealthBar");
   const dummyHealthPercentage = dummy.health / 100;
   dummyHealthBar.style.width = `${dummyHealthPercentage * 100}%`;

   const dummyEnergyBar = document.getElementById("dummyEnergyBar");
   const dummyEnergyPercentage = dummy.energy / 100;
   dummyEnergyBar.style.width = `${dummyEnergyPercentage * 100}%`;
 }

 function updateXPBar() {
   const playerXP = document.getElementById('playerXP');
   const playerLevel = document.getElementById('playerLevel');
   const playerXPBar = document.getElementById('playerXPBar');
   const xpNeeded = document.getElementById('xpNeeded');

   // Assuming player object has level and xp properties
   const currentXP = player.xp;
   const requiredXP = player.level * 100; // You can modify the XP scaling
   const xpProgress = Math.min((currentXP / requiredXP) * 100, 100);

   // Update XP display
   playerXP.textContent = currentXP;
   xpNeeded.textContent = requiredXP;

   // Update XP bar
   playerXPBar.style.width = xpProgress + '%';

   // Level up check (example)
   if (currentXP >= requiredXP) {
     player.level++;
     player.xp = 0; // Reset XP after leveling up
     updateXPBar(); // Recalculate the XP bar after leveling up
   }
 }

 // Function to log actions in the log section
 function logAction(message, type = "default") {
   const logElement = document.getElementById("log");
   if (!logElement) {
     console.error("Log element not found");
     return;
   }

   const entry = document.createElement("p");
   entry.textContent = message;
   entry.classList.add("log-entry", type); // Add class based on type

   logElement.appendChild(entry);
   logElement.scrollTop = logElement.scrollHeight;
 }

 // Function to apply damage to player or dummy and trigger shaking effect
 function takeDamage(target) {
   target.health -= 10;
   // Add shake effect when damage is taken
   const targetHealthBar = target === player ? document.getElementById("playerHealthBar") : document.getElementById("dummyHealthBar");
   targetHealthBar.classList.add("shake");
   setTimeout(() => targetHealthBar.classList.remove("shake"), 500); // Remove shake after animation
   updateBars();
 }

 // Function to gain XP and level up the player
 function gainXP(amount) {
   player.xp += amount;
   logAction(`Gained ${amount} XP.`);

   while (player.xp >= player.level * 100) {
     player.xp -= player.level * 100;
     player.level++;

     const healthGain = Math.floor(20 * Math.pow(1.1, player.level));
     const energyGain = Math.floor(15 * Math.pow(1.08, player.level));

     player.maxHealth += healthGain;
     player.maxEnergy += energyGain;

     player.health = player.maxHealth;
     player.energy = player.maxEnergy;

     logAction(`Leveled up! Now level ${player.level}.`);
     logAction(`+${healthGain} Max HP, +${energyGain} Max Energy.`);
   }

   updateStats(); // Update UI
 }

 // Function to toggle between light and dark themes
 function toggleTheme() {
   // Check if the body has the 'dark-theme' class
   if (document.body.classList.contains("dark-theme")) {
     // Remove dark theme and apply light theme
     document.body.classList.remove("dark-theme");
     localStorage.setItem("theme", "light"); // Save the preference
   } else {
     // Apply dark theme and remove light theme
     document.body.classList.add("dark-theme");
     localStorage.setItem("theme", "dark"); // Save the preference
   }
 }

 // Function to apply the saved theme on page load
 function applySavedTheme() {
   const savedTheme = localStorage.getItem("theme"); // Retrieve the saved theme

   if (savedTheme === "dark") {
     document.body.classList.add("dark-theme");
   } else {
     document.body.classList.remove("dark-theme");
   }
 }

 // Apply the saved theme when the page loads
 window.onload = applySavedTheme;

   // Set up the theme switch toggle
   const themeSwitch = document.getElementById("themeSwitch");
   if (themeSwitch) {
     themeSwitch.addEventListener("change", toggleTheme);
   };

 function canUseAbility() {
   if (gameEnded) {
     logAction("The battle is over. Press 'Battle Again' to continue.");
     return false;
   }
   return true;
 }

 function useUnseenHand() {
   if (!canUseAbility()) return;

   if (!playerTurn) {
     logAction("Wait for your turn!", "info");
     return;
   }
     let baseDamage = 15;
     let finalDamage = baseDamage;

     // Check if equipped weapon modifies ability damage
     if (equipment.weapon && typeof equipment.weapon.onAbilityUse === "function") {
       finalDamage = equipment.weapon.onAbilityUse(baseDamage, "unseenHand");
     }

     let energyStolen = Math.min(dummy.energy, 5);
     dummy.energy -= energyStolen;
     player.energy += energyStolen;

     dummy.health -= finalDamage;

     console.log("Ability name passed:", "unseenHand");

     logAction(`You strike with Unseen Hand, dealing ${finalDamage} damage and stealing ${energyStolen} energy!`, "attack");
     checkBattleEnd();
     endTurn();
     updateBars();
   }

 function useDivineProtection() {
   if (!canUseAbility()) return;

   if (!playerTurn) {
   logAction("Wait for your turn!", "info");
   return;
 }

   if (player.divineProtectionCooldown > 0) {
     logAction("Divine Protection is on cooldown!", "info");
     return;
   }

     if (player.energy >= 30) {
         player.energy -= 30;
         player.divineBarrierTurns = 3;
         logAction("Divine Protection activated. Immune to damage for 3 turns.", "heal");
         player.divineProtectionCooldown = 4;
         updateStats();
         endTurn();
     } else {
         logAction("Not enough energy for Divine Protection.", "info");
     }
     updateBars();
 }

 function useLordOfTheRealm() {
   if (!canUseAbility()) return;

   if (!playerTurn) {
   logAction("Wait for your turn!", "info");
   return;
 }

   if (player.lordOfTheRealmCooldown > 0) {
     logAction("Lord Of The Realm is on cooldown!", "info");
     return;
   }

     if (player.energy >= 50) {
         player.energy -= 50;
         dummy.health -= 30;
         player.realmTurns = 3;
         logAction("Lord of the Realm used. Dummy takes 30 damage.", "attack");
         player.lordOfTheRealmCooldown = 4;
         activateDivineOne();
         updateStats();
         checkBattleEnd();
         endTurn();
     } else {
         logAction("Not enough energy for Lord of the Realm.", "info");
     }
     updateBars();
 }

 function activateDivineOne() {
     player.divineOneBarrier = 3;
     logAction("Passive 'Divine One' activated. Player will be healed for 3 turns.", "heal");
 }

 function generateEnergy() {
   if (!canUseAbility()) return;

   if (!playerTurn) {
   logAction("Wait for your turn!");
   return;
 }

   if (!player.isGeneratingEnergy) {
     player.isGeneratingEnergy = true;
     logAction("You begin generating energy. +10 energy next turn.");
     updateStats();
     endTurn();
   } else {
     logAction("Already generating energy.");
   }
   updateBars();
 }

 function updateInventoryUI() {
   inventory.forEach((item, index) => {
     const invSlot = document.getElementById(`inv-slot-${index}`);
     invSlot.textContent = item ? item.name : "Empty";

     invSlot.setAttribute("draggable", true);
     invSlot.addEventListener("dragstart", (e) => {
       if (item) {
         e.dataTransfer.setData("text/plain", `inventory-${index}`);
       }
     });

     invSlot.addEventListener("dragover", (e) => {
       e.preventDefault();
       invSlot.classList.add("drag-over");
     });

     invSlot.addEventListener("dragleave", () => {
       invSlot.classList.remove("drag-over");
     });

     invSlot.addEventListener("drop", (e) => {
       e.preventDefault();
       invSlot.classList.remove("drag-over");

       const data = e.dataTransfer.getData("text/plain");
       if (data.startsWith("equipment-")) {
         const equipType = data.split("-")[1];
         const equippedItem = equipment[equipType];
         if (equippedItem) {
           // Place the item from the equipment slot into the inventory
           inventory[index] = equippedItem;
           equipment[equipType] = null;
           logAction(`Removed ${equippedItem.name} from ${capitalize(equipType)} and placed it in inventory.`);
           updateInventoryUI();
           updateEquipmentUI();
         }
       } else if (data.startsWith("inventory-")) {
         // If we're swapping items between inventory slots
         const sourceIndex = parseInt(data.split("-")[1]);
         const sourceItem = inventory[sourceIndex];
         if (sourceItem) {
           // Swap the items between the two inventory slots
           inventory[sourceIndex] = inventory[index];
           inventory[index] = sourceItem;
           updateInventoryUI();
         }
       }
     });
   });
 }

 function capitalize(str) {
   return str.charAt(0).toUpperCase() + str.slice(1);
 }

 function updateEquipmentUI() {
   const equipmentTypes = ["head", "chest", "arms", "legs", "weapon"];

   equipmentTypes.forEach(type => {
     const slot = document.getElementById(`slot-${type}`);
     const item = equipment[type];
     slot.textContent = item ? `${capitalize(type)}: ${item.name}` : `${capitalize(type)}: None`;

     // Allow dragging the item from equipment slot
     slot.setAttribute("draggable", true);
     slot.addEventListener("dragstart", (e) => {
       if (item) {
         // Start dragging the item
         e.dataTransfer.setData("text/plain", `equipment-${type}`);
       }
     });

     slot.addEventListener("dragover", (e) => {
       e.preventDefault();
       slot.classList.add("drag-over");
     });

     slot.addEventListener("dragleave", () => {
       slot.classList.remove("drag-over");
     });

     slot.addEventListener("drop", (e) => {
       e.preventDefault();
       slot.classList.remove("drag-over");

       const data = e.dataTransfer.getData("text/plain");
       if (data.startsWith("inventory-")) {
         const index = parseInt(data.split("-")[1]);
         const item = inventory[index];

         // Check if item exists before trying to access its properties
         if (!item) {
           console.log("No item found in inventory slot.");
           return; // Exit early if no item is found
         }

         // Normalize both item.type and slot type (case insensitive)
         const normalizedSlotType = type.toLowerCase(); // "helmet", "weapon", etc.
         let finalItemType = item.type.toLowerCase(); // "armor", "weapon", etc.

         // Correct the type mismatch between "Armor" and "helmet"
         //if (finalItemType === "armor") finalItemType = "helmet"; // Map "armor" to "helmet"

         // Check if the item type matches the slot type
         if (finalItemType === normalizedSlotType) {
           // If an item is already equipped in that slot, move it to inventory
           if (equipment[normalizedSlotType]) {
             // Find an empty inventory slot to store the old equipment
             const emptyIndex = inventory.findIndex(slot => slot === null || slot === undefined);
             if (emptyIndex !== -1) {
               inventory[emptyIndex] = equipment[normalizedSlotType]; // Move old item to empty slot
               logAction(`Unequipped ${equipment[normalizedSlotType].name} from ${capitalize(normalizedSlotType)}`);
             } else {
               console.log("No empty inventory slots available!");
               return;
             }
           }

           // Equip the item and remove it from inventory
           equipment[normalizedSlotType] = item;
           inventory[index] = null; // Remove the item from inventory

           logAction(`Equipped ${item.name} to ${capitalize(normalizedSlotType)}`);
           updateInventoryUI();
           updateEquipmentUI(); // Ensure the equipment UI is updated
         } else {
           console.log(`Cannot equip ${item.name} to ${capitalize(normalizedSlotType)}`);
         }
       }
     });
   });
 }

   // Update equipment slots
   document.getElementById("slot-head").textContent = `Head: ${equipment.head ? equipment.head.name : "None"}`;
   document.getElementById("slot-chest").textContent = `Chest: ${equipment.chest ? equipment.chest.name : "None"}`;
   document.getElementById("slot-arms").textContent = `Arms: ${equipment.arms ? equipment.arms.name : "None"}`;
   document.getElementById("slot-legs").textContent = `Legs: ${equipment.legs ? equipment.legs.name : "None"}`;
   document.getElementById("slot-weapon").textContent = `Weapon: ${equipment.weapon ? equipment.weapon.name : "None"}`;

   // Add Item to Inventory
   function addItemToInventory(item) {
     const emptyIndex = inventory.findIndex(i => i === null);
     if (emptyIndex !== -1) {
       inventory[emptyIndex] = item;
       updateInventoryUI();
       logAction("Added item: " + item.name);
     } else {
       logAction("Inventory is full! Could not add: " + item.name);
     }
   }

 // Equip the item based on its type
 // Equip Item from Inventory
 function equipItemFromInventory(index) {
   const item = inventory[index];
   if (!item) {
     logAction("No item in that slot.");
     return;
   }

   if (!item.type || !equipment.hasOwnProperty(item.type.toLowerCase())) {
     logAction("That item can't be equipped.");
     return;
   }

   const slot = item.type.toLowerCase();
   const currentlyEquipped = equipment[slot];

   // Swap with equipped item
   equipment[slot] = item;
   inventory[index] = currentlyEquipped || null;

   logAction(`Equipped ${item.name} to ${slot}.`);
   updateInventoryUI();
   updateEquipmentUI();
 }

 function unequipItem(slot) {
   const item = equipment[slot];
   if (!item) {
     logAction("Nothing is equipped in that slot.");
     return;
   }

   const emptyIndex = inventory.findIndex(i => i === null);
   if (emptyIndex === -1) {
     logAction("Inventory full! Cannot unequip.", "error");
     return;
   }

   equipment[slot] = null;
   inventory[emptyIndex] = item;
   logAction(`Unequipped ${item.name} from ${slot}.`);
   updateInventoryUI();
   updateEquipmentUI();
 }

 // Example Item Constructor (Modify based on your item structure)
 function createItem(name, description, type, effect) {
   return {
     name: name,
     description: description || "No description available",
     type: type || "General",
     effect: effect || null,
     onAbilityUse: (effect && typeof effect === "object" && typeof effect.onAbilityUse === "function")
       ? effect.onAbilityUse
       : null,
   };
 }

 // Items that currently exist
 //const sword = createItem("Sword", "A sharp blade for combat.");
 //addItemToInventory(sword);

 const sword = createItem("Sword", "Boosts your power!", "Weapon", {
     onAbilityUse: (baseDamage, abilityName) => {
       console.log(`onAbilityUse called for ability: ${abilityName}`);
       if (abilityName === "unseenHand") {
         logAction("Your hand wavers..");
         console.log("Base damage:", baseDamage);
         return baseDamage * 2;
       }
       return baseDamage;
     }
   });
   addItemToInventory(sword);
   updateInventoryUI();
   updateEquipmentUI();

 // Function to open the inventory
 function openInventory() {
   const inventoryScreen = document.getElementById("inventoryScreen");
   console.log("Inventory Screen:", inventoryScreen); // Add this to debug
   if (inventoryScreen) {
     inventoryScreen.style.display = "block";  // Show inventory screen
   } else {
     console.error("Inventory screen not found!");
   }
 }

 function closeInventory() {
   const inventoryScreen = document.getElementById("inventoryScreen");
   const mainMenu = document.getElementById("mainMenu"); // Make sure mainMenu exists
   if (inventoryScreen && mainMenu) {
     inventoryScreen.style.display = "none"; // Hide inventory screen
     mainMenu.style.display = "block"; // Show main menu
   } else {
     console.error("One or more elements are missing from the DOM!");
   }
 }

 // Loot table with item data instead of just names
 const lootTable = [
   { name: "Coins", description: "A handful of coins.", type: "Currency" },
   { name: "Potion", description: "A healing potion.", type: "Potion" },
   { name: "Sword", description: "A sharp sword for combat.", type: "Weapon" },
   { name: "Helmet", description: "A sturdy helmet for protection.", type: "Head" },
   { name: "Chestpiece", description: "A sturdy chestpiece for protection.", type: "Chest" }
 ];

 // Drop loot function
 function dropLoot() {
   console.log("dropLoot called");
   const loot = [];
   console.log("Dropping loot...");

   // Drop items based on random probabilities
   if (Math.random() < 0.9) loot.push(createItem(lootTable[0].name, lootTable[0].description, lootTable[0].type)); // Coins
   if (Math.random() < 0.9) loot.push(createItem(lootTable[1].name, lootTable[1].description, lootTable[1].type)); // Potion
   if (Math.random() < 0.9) loot.push(createItem(lootTable[2].name, lootTable[2].description, lootTable[2].type)); // Sword
   if (Math.random() < 0.9) loot.push(createItem(lootTable[3].name, lootTable[3].description, lootTable[3].type)); // Helmet
   if (Math.random() < 0.9) loot.push(createItem(lootTable[4].name, lootTable[4].description, lootTable[4].type)); // Chestpiece

   console.log("Loot generated:", loot);

   // Process each item dropped
   loot.forEach(item => {
     logAction(`Loot dropped: ${item.name}!`);

       // Add items to inventory
       addItemToInventory(item);

         updateInventoryUI(); // Update the inventory UI after adding items
     });
   };

   function resetBattle(isVictory) {
     gameEnded = true;
     // Reset player and dummy stats (based on level)
     player.health = 100 + (player.level - 1) * 20;
     player.energy = 100 + (player.level - 1) * 20;
     dummy.health = 100;
     dummy.energy = 50;

     // Reset ability cooldowns
     player.divineProtectionCooldown = 0; // Reset Divine Protection cooldown
     player.lordOfTheRealmCooldown = 0;   // Reset Lord of the Realm cooldown
     player.divineBarrierTurns = 0;
     player.realmTurns = 0;
     player.divineOneBarrier = 0;

     // Reset turn number
     turnNumber = 1;
     document.getElementById("turnCounter").textContent = "Turn: " + turnNumber;

     // Update stats and bars
     updateStats();
     updateBars();

     // Reset UI for next round
     const postBattleScreen = document.getElementById("postBattle");
     const inventoryScreen = document.getElementById("inventoryScreen");
     const startNewBattleButton = document.getElementById("startNewBattleButton");
     const inventoryButton = document.getElementById("inventoryButton");

     // Check if UI elements are valid before manipulating
     if (postBattleScreen && inventoryScreen && startNewBattleButton && inventoryButton) {
       postBattleScreen.style.display = "block";  // Show the post-battle screen
       inventoryScreen.style.display = "none";   // Ensure inventory screen is hidden
       startNewBattleButton.style.display = "block"; // Show the "Start New Battle" button
       inventoryButton.style.display = "block"; // Show the "Inventory" button
     } else {
       console.error("One or more elements are missing from the DOM!");
     }

     // Reset the turn system (next round should start with the player's turn)
     playerTurn = true; // Player gets the first turn in the next round

     // If the battle is over and there's a victory, you can handle it here
     if (isVictory) {
       logAction("You win! Preparing next round...");
     } else {
       logAction("You were defeated! Try again!");
     }
   }

   // Example of calling this function after a battle ends
   function checkBattleEnd() {
     if (player.health <= 0) {
       logAction("You were defeated!");  // Log defeat message
       gainXP(20);  // Award XP for losing
       resetBattle(false);  // Reset battle on defeat
       return true; // Indicate that battle ended
     }

     if (dummy.health <= 0) {
       logAction("You defeated the training dummy!");
       gainXP(50);
       dropLoot();
       resetBattle(true);  // Reset battle on victory
       return true; // Indicate that battle ended
     }

     return false; // No one died, battle continues
   }

   // Function to start a new battle and reset everything
   // Start New Battle
   function startNewBattle() {
     // Reset game state
     gameEnded = false; // Reset game status for new battle

     // Reset player and dummy stats
     player.health = 100 + (player.level - 1) * 20;
     player.energy = 100 + (player.level - 1) * 20;
     dummy.health = 100;
     dummy.energy = 50;  // Give dummy some energy for next round

     // Reset cooldowns
     player.divineProtectionCooldown = 0;
     player.lordOfTheRealmCooldown = 0;
     player.divineBarrierTurns = 0;
     player.realmTurns = 0;
     player.divineOneBarrier = 0;

     // Reset turn system
     playerTurn = true;
     turnNumber = 1;
     document.getElementById("turnCounter").textContent = "Turn: " + turnNumber;

     // Update stats and UI
     updateStats();
     updateBars();

     // Hide post-battle screen and inventory if they are visible
     const postBattleScreen = document.getElementById("postBattle");
     const inventoryScreen = document.getElementById("inventoryScreen");

     if (postBattleScreen) postBattleScreen.style.display = "none";
     if (inventoryScreen) inventoryScreen.style.display = "none";

     // Log new round start
     logAction("A new round has begun.");
   }

   // End Turn
   function endTurn() {
     playerTurn = false;

     // Check if the game is over
     if (dummy.health <= 0) {
       resetBattle(true); // Victory
       return;
     }

     if (player.health <= 0) {
       resetBattle(false); // Defeat
       return;
     }

     // Handle energy generation
     if (player.isGeneratingEnergy) {
       player.energy += 10;
       player.isGeneratingEnergy = false;
       logAction("Energy generated! +10 energy.");
     }

     // Handle divine one barrier healing
     if (player.divineOneBarrier > 0) {
       player.health += 10;
       logAction("Player gained +10 health.", "heal");
     }

     // 🛡️ Only run dummy's turn if battle hasn't ended
     if (!gameEnded) {
       setTimeout(() => {
         enemyTurn();
         updateStats();
         updateBars();
         playerTurn = true;
       }, 1000);
     }
   }

function enemyTurn() {
  dummy.energy += 10;

  if (dummy.energy >= 20) {
    dummy.energy -= 20;

    if (player.divineBarrierTurns > 0) {
      logAction("Dummy attacked, but Divine Protection blocked the damage!");
    } else {
      player.health -= 10;
      logAction("Dummy attacks! You take 10 damage.");
    }
  } else {
    logAction("Dummy is charging energy...");
  }

  // Decrement cooldowns and durations AFTER the full turn
  player.divineProtectionCooldown = Math.max(0, player.divineProtectionCooldown - 1);
  player.lordOfTheRealmCooldown = Math.max(0, player.lordOfTheRealmCooldown - 1);
  player.divineBarrierTurns = Math.max(0, player.divineBarrierTurns - 1);
  player.realmTurns = Math.max(0, player.realmTurns - 1);
  player.divineOneBarrier = Math.max(0, player.divineOneBarrier - 1);

  // Now increment turn counter at the end of the full round
  turnNumber++;
  document.getElementById("turnCounter").textContent = "Turn: " + turnNumber;

  checkBattleEnd();
  updateBars();
}
