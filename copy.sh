# copy the CSS overrides to remove the RetroLab chrome
cp index.css _output/retro/consoles/index.css

# add the extra CSS to the main page
sed -i '/<title>/a <link rel='stylesheet' href='./index.css' />' _output/retro/consoles/index.html
