#!/bin/bash

# Get the package name from the command line argument
PACKAGE_NAME=$1

if [ -z "$PACKAGE_NAME" ]
then
  echo "No package name supplied [Usage: npm run new-package <package-name>]"
  exit 1
fi

# Set the full package name
FULL_PACKAGE_NAME="@elementor/$PACKAGE_NAME"

# Create a new directory for the package
cd packages
mkdir $PACKAGE_NAME
cd $PACKAGE_NAME

# Initialize a new npm package
npm init -y

# Create a JavaScript file that modifies package.json
echo "const fs = require('fs');
let package = require('./package.json');
package.name = '$FULL_PACKAGE_NAME';
package.version = '0.0.0';
package.repository = {type: 'git', url: 'https://github.com/elementor/ecp-utils.git'};
package.publishConfig = {registry: 'https://npm.pkg.github.com/elementor'};
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));" > updatePackage.js

# Run the JavaScript file
node updatePackage.js

# Remove the JavaScript file
rm updatePackage.js

mkdir src
echo "console.log('Hello - $PACKAGE_NAME');" > src/index.ts
cp ../../tsconfig.json .
cp ../../tsconfig.build.json .
cp ../../.eslintrc.js .
