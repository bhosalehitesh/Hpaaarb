package com.sakhic;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.sakhic.ReactNativeFlipper;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new ArrayList<>();
          // Add MainReactPackage which includes all core React Native modules
          packages.add(new MainReactPackage());
          // Add react-native-view-shot package manually
          packages.add(new RNViewShotPackage());
          // Autolinking packages are added automatically by React Native Gradle Plugin
          // Additional manual packages can be added here if needed:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    // Initialize Flipper only in debug mode and wrap in try-catch to prevent crashes
    if (BuildConfig.DEBUG) {
      try {
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
      } catch (Exception e) {
        // Flipper initialization failed, continue without it
        android.util.Log.e("MainApplication", "Failed to initialize Flipper", e);
      }
    }
  }
}
