fx_version 'cerulean'
game 'gta5'

client_scripts {
    'dist/client/*.js',
    'main.lua'
}

server_scripts {
    'dist/server/*.js',
}

files {
    'data/*.json'
}

ui_page 'http://localhost:5173/'

lua54 'yes'