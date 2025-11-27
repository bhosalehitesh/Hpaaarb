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
// The simplest approach: use the same path that settings.gradle uses
// settings.gradle is at Frontend/android/settings.gradle
// It uses: file("../node_modules/...")
// So from android/, "../node_modules" = Frontend/node_modules/
const gradleContent = `def autoModules = {
    // Get the directory where THIS gradle file is located
    def gradleFile = new File(getClass().protectionDomain.codeSource.location.toURI())
    def gradleFileDir = gradleFile.parentFile
    // From: Frontend/node_modules/@react-native-community/cli-platform-android/
    // Go up 2 levels to: Frontend/node_modules/
    def nodeModulesDir = gradleFileDir.parentFile.parentFile
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        throw new GradleException("React Native not found at \${reactNative.absolutePath}. Expected: \${nodeModulesDir.absolutePath}/react-native")
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
