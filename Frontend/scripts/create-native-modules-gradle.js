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
const gradleContent = `def autoModules = {
    // From: Frontend/node_modules/@react-native-community/cli-platform-android/
    // Go up 3 levels to Frontend/node_modules/, then find react-native
    def nodeModulesDir = file("../../..")
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        throw new GradleException("React Native not found at \${reactNative.absolutePath}")
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

