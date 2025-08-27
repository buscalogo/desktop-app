const { notarize } = require('@electron/notarize');

module.exports = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  
  // Só notarizar para macOS
  if (electronPlatformName !== 'darwin') {
    return;
  }

  // Verificar se as variáveis de ambiente estão configuradas
  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`🔐 Notarizando ${appPath}...`);

  try {
    await notarize({
      tool: 'notarytool',
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    console.log('✅ Notarização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na notarização:', error);
    
    // Em CI/CD, não falhar o build se a notarização falhar
    if (process.env.CI) {
      console.log('⚠️ Continuando build sem notarização (ambiente CI)');
      return;
    }
    
    throw error;
  }
};
