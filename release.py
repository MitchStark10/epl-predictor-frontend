#Release Script to tag and deploy the latest build
import os
import json

releaseTypes = ["major", "minor", "patch"]

#Determine what type of release this is
releaseType = input("Type of release (Major/Minor/Patch):")

if not (releaseType.lower() in releaseTypes):
	raise Exception("Unknown release type: " + releaseType)

#Checkout master
os.system("git checkout master")

#Merge develop
os.system("git merge develop")

newPackageVersion = ""
newPackageInfo = {}
#Update version number
with open ("package.json") as file:
	packageInfo = json.load(file)
	packageVersionNumbers = packageInfo['version'].split('.')

	if releaseType.lower() == "major":
		packageVersionNumbers[0] = str(int(packageVersionNumbers[0]) + 1)
		packageVersionNumbers[1] = 0
		packageVersionNumbers[2] = 0
	elif releaseType.lower() == "minor":
		packageVersionNumbers[1] = str(int(packageVersionNumbers[1]) + 1)
		packageVersionNumbers[2] = 0
	else:
		packageVersionNumbers[2] = str(int(packageVersionNumbers[2]) + 1)

	newPackageVersion = ".".join(packageVersionNumbers)
	packageInfo['version'] = newPackageVersion
	newPackageInfo = packageInfo

packageJsonFile = open("package.json", "w")
packageJsonFile.write(json.dumps(newPackageInfo, indent=4))
packageJsonFile.close()

#Commit
os.system('git add .')
os.system('git commit -m "release version ' + newPackageVersion + '"')

#Tag version number
os.system('git tag v' + newPackageVersion)

#Push commit
os.system('git push -u origin master')

#Push tags
os.system('git push --tags')

#Checkout develop
os.system('git checkout develop')
os.system('git merge master')
os.system('git push')
