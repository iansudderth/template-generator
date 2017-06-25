#!usr/bin/env node


const _ = require('lodash');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const CURR_DIR = process.cwd();
const TEMPLATE_DIR = `${__dirname}/templates`

// let templatename = _.split(CURR_DIR,"/")
// templatename = templatename[templatename.length-1];
const QUESTIONS = [
	{
		name:'template-name',
		type:'input',
		message:'Template name?',
		validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
	}
}
]

inquirer.prompt(QUESTIONS)
	.then(checkAvailability)
	.then(createTemplateDirectory)
	.then(createDirectoryContents)
	.catch(errorHandler);


 function checkAvailability(answer){
	return new Promise((resolve,reject) => {
		fs.pathExists(`${TEMPLATE_DIR}/${answer['template-name']}`)
		.then(result => {
		if(!result){
			resolve(answer['template-name']);
		} else {
			reject("Template with that name already exists.")
		}
		},
		error => {
			reject(error);
		}
		)
	});
}

function createTemplateDirectory(name){
	fs.ensureDir(`${TEMPLATE_DIR}/${name}`)
	return new Promise((resolve,reject) => {
		resolve(name)
	})
}

function createDirectoryContents (name) {
 	fs.copy(CURR_DIR,`${TEMPLATE_DIR}/${name}`)
 	.then((otherInfo)=>{
 		console.log(`Template ${name} created.`)
 		if(otherInfo){
 		console.log(otherInfo)
 	}
 	})
}


function errorHandler(error){
	console.log(error);
}


// fs.mkdirSync(`${TEMPLATE_DIR}/${templatename}`)

