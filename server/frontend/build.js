const { exec } = require('child_process');

exec('react-scripts build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Build stderr: ${stderr}`);
    return;
  }
  console.log(`Build stdout: ${stdout}`);
});
