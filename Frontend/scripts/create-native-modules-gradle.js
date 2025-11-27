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
    // Gradle resolves file() paths relative to the project root (Frontend/android/)
    // From android/, "../node_modules/react-native" = Frontend/node_modules/react-native
    def reactNativeDir = file("../node_modules/react-native")
    def reactNativePackageJson = new File(reactNativeDir, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        throw new GradleException("React Native not found at \${reactNativeDir.absolutePath}. Please run: npm install")
    }
    
    def reactNativeVersion = new groovy.json.JsonSlurper().parseText(reactNativePackageJson.text).version
    def reactNativeMinorVersion = reactNativeVersion.split("\\\\.")[1].toInteger()

    if (reactNativeMinorVersion >= 73) {
        return new File(reactNativeDir, "scripts/autolinking.gradle")
    } else {
        return new File(reactNativeDir, "react.gradle")
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
