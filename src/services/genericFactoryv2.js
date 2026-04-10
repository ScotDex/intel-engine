const helpers = require('../core/helpers');

const IS_COMPONENTS_V2 = 1 << 15;

class NewsEmbedFactoryV2 {
    static createEmbed(kill, zkb, names, category) {
        const totalValue = helpers.formatIsk(names.rawValue);
        const article = helpers.getArticle(names.shipName);
        const zkillUrl = `https://zkillboard.com/kill/${kill.killmail_id}/`;

        // Dynamic Branding Colors
        let accentColor = 0x3fb950; // Socket.Kill Green
        if (names.rawValue >= 10_000_000_000) accentColor = 0xf1c40f; // Gold for 10B+
        if (category === 'officer' || category === 'at_ships') accentColor = 0xa335ee; // Purple for Ultra-Rares

        return {
            username: "Socket.Kill Intel",
            avatar_url: "https://edge.socketkill.com/favicon.png",
            flags: IS_COMPONENTS_V2,
            components: [
                {
                    type: 17, // Primary Container
                    accent_color: accentColor,
                    components: [
                        // SECTION 1: The Victim & Ship Header
                        {
                            type: 9,
                            components: [
                                {
                                    type: 10,
                                    content: `## ${names.finalVictimName} lost ${article} ${names.shipName}\n**Corp:** ${names.corpName}`
                                }
                            ],
                            accessory: {
                                type: 11,
                                media: { url: `https://images.evetech.net/characters/${kill.victim.character_id}/portrait?size=128` }
                            }
                        },
                        { type: 14, spacing: 1, divider: true },

                        // SECTION 2: Tactical Grid (Multi-column content)
                        {
                            type: 9,
                            components: [
                                {
                                    type: 10,
                                    content: `**Economic Impact**\nValue: ${totalValue} ISK\nDropped: ${helpers.formatIsk(zkb.droppedValue || 0)}`
                                },
                                {
                                    type: 10,
                                    content: `**Environment**\nSystem: ${names.systemName}\nRegion: ${names.regionName}`
                                }
                            ],
                            accessory: {
                                type: 11,
                                media: { url: `https://images.evetech.net/types/${kill.victim.ship_type_id}/render?size=128` }
                            }
                        },

                        // SECTION 3: Engagement Metadata
                        { type: 14, spacing: 1, divider: true },
                        {
                            type: 10,
                            content: `**Engagement:** ${names.attackerCount} Attackers | **Final Blow:** ${names.finalBlowCorp}`
                        },

                        // FOOTER
                        {
                            type: 10,
                            content: `-# socketkill.com | Real-time EVE Intel · <t:${Math.floor(Date.now() / 1000)}:R>`
                        }
                    ]
                },
                // ACTION ROW: Direct Links
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: "View on zKillboard",
                            url: zkillUrl
                        },
                        {
                            type: 2,
                            style: 5,
                            label: "Socket.Kill Analysis",
                            url: `https://socketkill.com/kill/${kill.killmail_id}` // Direct site integration
                        }
                    ]
                }
            ]
        };
    }
}

module.exports = NewsEmbedFactoryV2;