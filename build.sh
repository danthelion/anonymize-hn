EXCLUDES="*.git* *.DS_Store* *.sh* *.md* *.zip*"

rm -f extension.zip
zip -r -FS extension.zip * -x "$EXCLUDES"
