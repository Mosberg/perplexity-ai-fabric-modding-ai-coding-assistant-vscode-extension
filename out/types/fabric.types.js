"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPAWN_GROUPS = exports.PACKAGE_STRUCTURE = exports.FABRIC_REGISTRIES = void 0;
/**
 * Fabric registry identifiers
 */
exports.FABRIC_REGISTRIES = {
    BLOCK: 'block',
    ITEM: 'item',
    ENTITY_TYPE: 'entity_type',
    COMMAND: 'command',
    SCREEN_HANDLER: 'screen_handler'
};
/**
 * Java package structure for Fabric
 */
exports.PACKAGE_STRUCTURE = {
    COMMON: 'dk.mosberg',
    CLIENT: 'dk.mosberg.client',
    RENDER: 'dk.mosberg.client.render',
    SCREEN: 'dk.mosberg.client.screen',
    CONFIG: 'dk.mosberg.config',
    MIXIN: 'dk.mosberg.mixin'
};
/**
 * Fabric spawn groups for entities
 */
exports.SPAWN_GROUPS = [
    'MONSTER', 'CREATURE', 'AMBIENT', 'AXOLOTLS',
    'UNDERGROUND_WATER_CREATURE', 'WATER_CREATURE',
    'WATER_AMBIENT', 'MISC', 'MICRO_CREATURE'
];
//# sourceMappingURL=fabric.types.js.map