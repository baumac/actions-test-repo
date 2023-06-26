const yaml = require('js-yaml')
const fs = require('fs').promises

const pluginsToKeep = [
    'request-transformer',
    'request-transformer-advanced'
]

const reHelmtpl = /^\s*\${{.*/gim // replace top level conditions
const captureEnvTpl = /(\${{.*env.*"(.*)".*}})/gim // replace env variables

// replaces ${{ env "..." }} by their value in the template
function replaceEnvTemplateVars(str) {
    while ((m = captureEnvTpl.exec(str)) !== null) {
        if (m.index === captureEnvTpl.lastIndex) {
            captureEnvTpl.lastIndex++;
        }
        str = str.replace(m[0], m[2])
    }
    return str
}

async function run() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        throw new Error("invalid arguments. first argument is source, second is output `-` is prompt")
    }
    const srcFile = args[0]
    const outFile = args[1]

    let configStr = await fs.readFile(srcFile, 'utf-8')
    configStr = configStr.replace(reHelmtpl, '')
    configStr = replaceEnvTemplateVars(configStr)
    let config = yaml.load(configStr)
    delete config._plugin_configs
    config.plugins = []

    config.services.forEach(s => {
        s.routes && s.routes.forEach(r => {
            r.protocols = ['http']
        })
        if (s.plugins && s.plugins.length !== 0) {
            s.plugins = s.plugins.filter(p => {
                return pluginsToKeep.includes(p.name)
            })
        }
    })
    const yamlConfig = yaml.dump(config)
    if (outFile === "-") {
        console.log(yamlConfig)
    } else {
        await fs.writeFile(outFile, yamlConfig)
    }
}

run().catch(e => {
    console.log("an error as occured")
    console.error(e)
    process.exit(1)
})
