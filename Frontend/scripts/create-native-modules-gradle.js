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
    def reactNativeRoot = file("../../")
    def reactNative = file("\${reactNativeRoot}/node_modules/react-native")
    def reactNativePackageJson = file("\${reactNative}/package.json")
    def reactNativeVersion = new groovy.json.JsonSlurper().parseText(reactNativePackageJson.text).version
    def reactNativeMinorVersion = reactNativeVersion.split("\\\\.")[1].toInteger()

    if (reactNativeMinorVersion >= 73) {
        return file("\${reactNative}/scripts/autolinking.gradle")
    } else {
        return file("\${reactNative}/react.gradle")
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

if (!fs.existsSync(targetFile)) {
  fs.writeFileSync(targetFile, gradleContent);
  console.log('Created native_modules.gradle file');
} else {
  console.log('native_modules.gradle already exists');
}

