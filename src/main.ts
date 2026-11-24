// @ts-check
// A mob built only of Goals, with its own spawn rule and spawn category: the maned wolf (lobo-guará) of the plains.
// Nothing of it is in the game's code: the pieces (GoalMob, MeleeAttackGoal, WanderGoal, FleeGoal) and the rule come from the SDK.
import { FleeGoal, GoalMob, MeleeAttackGoal, ModInitializer, SpawnRuleType, WanderGoal } from './mineclaude-sdk.js';

// "only in the dark, only out on the plains": a rule as a class, its condition a method
class Matilha extends SpawnRuleType {
  when = 'night';
  zones = ['campos', 'ermos'];
  weight = 30; // among the mods' draws (together they take at most half)
  group = [2, 3];
  spread = 'pack'; // they share a group number: whoever hits one, the pack hunts
  light = { max: 0.3 };
  category = 'matilha:matilhas';
  test(e) { return e.y < 80; } // not on the mountains
}

class LoboGuara extends GoalMob {
  key = 'lobo_guara';
  name = 'Lobo-guará';
  halfW = 0.4;
  height = 1.0;
  behavior = 'hostile';
  hp = 14;
  speed = 2.8;
  damage = 3;
  burn = false; // the plains' sun does not hurt it
  drops = [['mineclaude:raw_meat', 1, 2], ['mineclaude:bone', 0, 1, 0.5]];
  spawn = [new Matilha()];
  // hunts the nearest player within 14 blocks, steering round obstacles; the one that gets hurt and the ones near it hunt the
  // attacker (pack); a wolf that is hurt while it has nobody to fight runs; else it strolls
  goals = [
    [1, new MeleeAttackGoal({ range: 14, maxDy: 6, reach: 1.5, every: 1.2, knock: 7, speed: 1.15, nav: 'steer', pack: { radius: 10, giveUp: 28 } })],
    [2, new FleeGoal()],
    [3, new WanderGoal()],
  ];
  // pixel-art by code: boxes (w, h, d), position of the center and a color
  model = {
    parts: [
      { size: [0.5, 0.45, 1.0], pos: [0, 0.65, 0], color: '#c8702c' }, // body
      { size: [0.4, 0.38, 0.45], pos: [0, 0.95, -0.65], color: '#d98a3d', role: 'head' },
      { size: [0.18, 0.15, 0.25], pos: [0, 0.88, -0.98], color: '#2b1d14' }, // snout
      { size: [0.12, 0.2, 0.08], pos: [-0.12, 1.22, -0.55], color: '#2b1d14' }, // ears
      { size: [0.12, 0.2, 0.08], pos: [0.12, 1.22, -0.55], color: '#2b1d14' },
      { size: [0.14, 0.5, 0.14], pos: [-0.17, 0.25, -0.35], color: '#2b1d14', role: 'leg', pivotTop: true },
      { size: [0.14, 0.5, 0.14], pos: [0.17, 0.25, -0.35], color: '#2b1d14', role: 'leg', pivotTop: true },
      { size: [0.14, 0.5, 0.14], pos: [-0.17, 0.25, 0.35], color: '#2b1d14', role: 'leg', pivotTop: true },
      { size: [0.14, 0.5, 0.14], pos: [0.17, 0.25, 0.35], color: '#2b1d14', role: 'leg', pivotTop: true },
      { size: [0.14, 0.14, 0.45], pos: [0, 0.8, 0.7], color: '#f1e3c9' }, // tail
    ],
  };
}

export default class MatilhaMod extends ModInitializer {
  onInitialize(ctx) {
    ctx.mobs.spawnCategory('matilhas', { cap: 4 }); // at most 4 near a player, whatever else is around
    ctx.mobs.register('lobo_guara', new LoboGuara());
  }
}
