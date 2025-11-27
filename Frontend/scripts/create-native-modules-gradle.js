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
    // This file is applied from Frontend/android/settings.gradle
    // The applyNativeModulesSettingsGradle function receives 'settings' parameter
    // We need to calculate the path from where settings.gradle is located
    // Since we can't access 'settings' in this closure, we use the file() function
    // which resolves relative to the project root (Frontend/android/)
    // From android/, "../node_modules/react-native" = Frontend/node_modules/react-native
    
    // Get the path to this gradle file to determine the project structure
    def gradleFilePath = file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle")
    def gradleFileDir = gradleFilePath.parentFile
    // From: Frontend/node_modules/@react-native-community/cli-platform-android/
    // Go up 2 levels: Frontend/node_modules/
    def nodeModulesDir = gradleFileDir.parentFile.parentFile
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        // Fallback: try the simple relative path from android/
        def fallbackReactNative = file("../node_modules/react-native")
        def fallbackPackageJson = new File(fallbackReactNative, "package.json")
        if (fallbackPackageJson.exists()) {
            reactNative = fallbackReactNative
            reactNativePackageJson = fallbackPackageJson
        } else {
            throw new GradleException("React Native not found. Searched: \${reactNative.absolutePath} and \${fallbackReactNative.absolutePath}")
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
