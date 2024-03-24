# elementor-lerna-template

This is a monorepo template that supports both NX or Lerna.

## Structure

This repository is structured as a monorepo, meaning it hosts and manages multiple packages in the same repository. The packages are located under the `packages/` directory.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Bootstrap the packages: `npx lerna bootstrap`

## Adding a New TypeScript Package (Using Script)
Run the script ./new-package.sh my-package
this will create the new package for you on packages with needed changes. 
if you need additional steps excep the basic ones, go ahread and dd them nanualy to this newly created package.

## Adding a New TypeScript Package (Manual Flow)

To add a new TypeScript package to this monorepo, follow these steps:

1. Navigate to the `packages/` directory.
2. Create a new directory for your package: `mkdir <package-name>`
3. Navigate into the new package directory: `cd <package-name>`
4. Initialize a new package: `npm init -y`
5. Update the `name` field in the generated `package.json` to match the format `@<namespace>/<package-name>`
6. Install TypeScript and other necessary dependencies: `npm install typescript ts-node @types/node --save-dev`
7. Create a `tsconfig.json` file for TypeScript configuration.
8. Add any other dependencies your package needs: `npm install <dependency>`
9. Link the packages together: `npx lerna bootstrap`

Remember to replace `<package-name>` with the name of your package and `<namespace>` with the namespace for your project (usually the project name). Also, replace `<dependency>` with any dependencies your package needs.

## Update your repo to NX/Lerna
In order to Understand if there are changes on the packages we use simple script within scripts/affected.ts
Make sure to us ethe right version of it (NX/Lerna)

this script will check if pacakges updated since the last succesfull workflow.

## CI-CD
This repository includes basic CI-CD Flows.

### CI Workflow (ci.yaml)
 Simple CI process which will be triggered on every Push and will run basic operations to code base (npm install + build + lint + test)

### PreRelease Workflow(prerelease.yaml) 
A workflow that provides the developers the ability to test their module before publishing a concrete version.</br>

**How to use?**</br>
Once PR is ready for testing, developer can trigger manual action "PreRelease" to build the package and publish it to the Private Github NPM registry with temporary version for testing.</br>
Once done the package will be found on the repo packages view with the new versione-template/assets/86892806/ff99f66e-4f0e-49c3-be5e-e2be35a68264">
</br>

How to Consume?
`npm install @elementor/sample-package@1.0.0-pr-630707e`

### Release + Publish (release.yaml + publish.yaml)
These workflows reponsible for acting when PR merged to master. the workflows will do the following:</br>
- Bump the package version and Create a new release
- Publish a new Package to the github NPM Pri

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details

