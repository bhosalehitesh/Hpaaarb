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
// From there, go up 3 levels to Frontend/node_modules/, then find react-native
const gradleContent = `def autoModules = {
    // From the gradle file location, go up 3 levels to reach Frontend/node_modules/
    // ../ = cli-platform-android/
    // ../../ = @react-native-community/
    // ../../../ = node_modules/
    def nodeModulesDir = file("../../../")
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        throw new GradleException("React Native not found at \${reactNative.absolutePath}. Please ensure react-native is installed in node_modules.")
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

