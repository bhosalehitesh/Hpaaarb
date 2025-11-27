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
// From there, we need to go up 3 levels to get to Frontend/node_modules/, then find react-native
const gradleContent = `def autoModules = {
    // Get the directory where this gradle file is located
    def gradleFileDir = new File(getClass().protectionDomain.codeSource.location.toURI()).parentFile
    // Go up 3 levels: cli-platform-android -> @react-native-community -> node_modules -> Frontend/node_modules/
    def nodeModulesDir = gradleFileDir.parentFile.parentFile.parentFile
    def reactNative = new File(nodeModulesDir, "react-native")
    def reactNativePackageJson = new File(reactNative, "package.json")
    
    if (!reactNativePackageJson.exists()) {
        // Fallback: try relative path from gradle file location
        def fallbackReactNative = new File(gradleFileDir.parentFile.parentFile.parentFile, "react-native")
        if (fallbackReactNative.exists()) {
            reactNative = fallbackReactNative
            reactNativePackageJson = new File(reactNative, "package.json")
        } else {
            throw new GradleException("React Native not found. Searched at: \${reactNative.absolutePath}")
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

