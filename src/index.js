import '@css/style.css'
import Post from '@model/post'
import json from '@assets/data'
import logo from '@assets/icon-square-big'
import xml from '@assets/data.xml'
import csv from '@/assets/data.csv'
import $ from 'jquery'


const post = new Post('Webpack Post Title', logo )

$('pre').html(post.toString())

console.log('JSON:', json)

console.log(logo)

console.log('XML:', xml)

console.log('CSV:', csv)