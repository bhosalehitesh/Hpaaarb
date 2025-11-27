const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native-community',
  'cli-platform-android',
  'native_modules.gradle'
);

const targetDir = path.dirname(targetFile);

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create the native_modules.gradle file
// The gradle file is at: Frontend/node_modules/@react-native-community/cli-platform-android/native_modules.gradle
// From there, we need to find react-native which is at: Frontend/node_modules/react-native
const gradleContent = `def autoModules = {
    // Get the directory where this script file is located
    def scriptFile = new File(getClass().protectionDomain.codeSource.location.toURI())
    def scriptDir = scriptFile.parentFile
    // From: Frontend/node_modules/@react-native-community/cli-platform-android/
    // Go up 2 levels to: Frontend/node_modules/
    def nodeModulesDir = scriptDir.parentFile.parentFile
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    // If not found, try using the settings.gradle location as reference
    if (!reactNativePackageJson.exists()) {
        // Try alternative: use the project root from settings.gradle
        def projectRoot = settings.rootDir
        def altNodeModules = new File(projectRoot.parentFile, "node_modules")
        def altReactNative = new File(altNodeModules, "react-native")
        if (new File(altReactNative, "package.json").exists()) {
            reactNative = altReactNative
            reactNativePackageJson = new File(reactNative, "package.json")
        } else {
            throw new GradleException("React Native not found. Searched: \${reactNative.absolutePath} and \${altReactNative.absolutePath}")
        }
    }
    
    def reactNativeVersion = new groovy.json.JsonSlurper().parseText(reactNativePackageJson.text).version
    def reactNativeMinorVersion = reactNativeVersion.split("\\\\.")[1].toInteger()

    if (reactNativeMinorVersion >= 73) {
        return new File(reactNative, "scripts/autolinking.gradle")
    } else {
        return new File(reactNative, "react.gradle")
    }
}()

def applyNativeModulesSettingsGradle(settings) {
    includeBuild(autoModules.parentFile.parentFile)
    apply from: autoModules
}

def applyNativeModulesAppBuildGradle(project) {
    apply from: autoModules
}

ext.applyNativeModulesSettingsGradle = this.&applyNativeModulesSettingsGradle
ext.applyNativeModulesAppBuildGradle = this.&applyNativeModulesAppBuildGradle
`;

// Always overwrite to ensure we have the latest version
fs.writeFileSync(targetFile, gradleContent);
console.log('Created/updated native_modules.gradle file');

