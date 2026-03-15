const helpers = require('../core/helpers')


class atOfficerFactory {
    static createKillEmbed(kill, zkb, names) {
        const DOTLAN_BASE = 'https://evemaps.dotlan.net'
        const totalValue = helpers.formatIsk(zkb.totalValue)
        const corpIcon = `https://edge.socketkill.com/taylr/logo.png`;
        const title = 'Activity Detected';

        return {
            username: "Officer/AT Ship Alarm (Beta)",
            avatar_url: corpIcon,
            embeds: [{
                author: {
                    name: `${names.triggerShipName} spotted in ${names.systemName}`,
                    icon_url: `https://images.evetech.net/characters/${names.triggerShipId}/portrait?size=128`
                },
                title: title,
                url: `https://zkillboard.com/kill/${kill.killmail_id}/`,
                thumbnail: { url: `https://images.evetech.net/types/${kill.victim.ship_type_id}/render?size=256` },
                color: 0xf39c12,
                fields: [
                    { name: "System", value: `** [${names.systemName}](${DOTLAN_BASE}/system/${names.systemName.replace(/ /g, '_')}) ** `, inline: false },
                    { name: "Region", value: `** [${names.regionName}](${DOTLAN_BASE}/region/${names.regionName.replace(/ /g, '_')}) ** `, inline: false },
                    { name: "Pilot", value: names.triggerCharName, inline: false },
                    { name: "Corporation", value: names.triggerCorpName, inline: false },
                    { name: "Total Value", value: `**${totalValue} ISK**`, inline: false },
                ],
                footer: {
                    text: `Powered by socketkill.com`,
                    icon_url: "https://edge.socketkill.com/favicon.png"
                },
                timestamp: new Date().toISOString()
            }]
        };
    }
}

module.exports = atOfficerFactory;