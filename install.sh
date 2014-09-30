# Run this in the directory that you'd like to clone graph-json into
#!/bin/sh

# Step 1: Install Node/NPM
curl -O https://npmjs.org/install.sh &&
sh install.sh &&

# Step 2: Clone Repository
git clone https://github.com/mananshah99/graph-json &&
cd graph-json &&

# Step 3: Install dependencies
npm install &&
npm install mocha &&

# Step 4: Run tests!
mocha 
