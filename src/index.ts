import { exec } from 'child_process';
import { CURRENT_VERSION, TELEGRAM_URL } from './constants';

export { AminoDorks } from './core/aminodorks';
export { AminoDorksAPIError } from './exceptions/api';
export * as schemas from './schemas/index';

console.log(`\x1b[34mVisit our community:\x1b[32m ${TELEGRAM_URL}\x1b[0m`);
exec('npm view amino.dorks version', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error retrieving npm package version for amino.dorks: ${stderr.trim()}`);
        return;
    };
    const installedVersion = stdout.trim();

    if (installedVersion !== CURRENT_VERSION) {
        console.log(`\x1b[33mYou're using outdated version. amino.dorks v${installedVersion} is available.\x1b[0m`);
    };
});