const { exec } = require('child_process');

const server = exec('npx next dev -p 3005');
server.stdout.on('data', (d) => {
  console.log('Next:', d);
  if (d.includes('Ready in')) {
    fetch('http://localhost:3005/admin/login')
      .then(res => res.text().then(text => console.log('Status:', res.status, '\nBody:', text.substring(0, 300))))
      .catch(console.error)
      .finally(() => {
        server.kill();
        process.exit(0);
      });
  }
});
server.stderr.on('data', d => console.error('Next err:', d));
