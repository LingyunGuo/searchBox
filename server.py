from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import json
from urlparse import parse_qs

PORT_NUMBER = 8081

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
	
	#Handler for the GET requests
	def do_GET(self):
		self.send_response(200)
		self.send_header('Content-type','application/json')
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
		self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		param = parse_qs(self.path[2:])
		
		self.end_headers()
		# Send the html message
		print(param);
		self.wfile.write(json.dumps({
			"line": [
				[
					{
						"type":"text",
						"index":"0",
						"value":{
							"text":"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
						}
					},
					{
						"type":"img",
						"index":"0",
						"value":{
							"src":"http://www.globalstewards.org/images/fbshare/nature-animal-quotes.jpg"
						}
					}
					# ,
					# {
					# 	"type":"img",
					# 	"index":"1",
					# 	"value":{
					# 		"src":"http://www.havahart.com/blog/content/uploads/2015/09/squirrel-nut-cute-animal-nature-grass.jpg",
					# 		"class":"test"
					# 	}
					# }
				],
				[
					{
						"type":"text",
						"index":"0",
						"value":{
							"text":"similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga."
						}
					},
					{
						"type":"img",
						"index":"0",
						"value":{
							"src":"https://s-media-cache-ak0.pinimg.com/736x/00/30/20/003020f7199410afede9a5006395f822.jpg"
						}
					}
					# ,
					# {
					# 	"type":"img",
					# 	"index":"1",
					# 	"value":{
					# 		"src":"https://i.ytimg.com/vi/5fhizwmzSFc/maxresdefault.jpg"
					# 	}
					# }
				]
			],
			"block": [
				[
					{
						"type":"text",
						"index":"0",
						"value":{
							"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
						}
					}
				],
				[
					{
						"type":"text",
						"index":"0",
						"value":{
							"text":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
						}
					}
				]
			]
		}))
		return

try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'Started httpserver on port ' , PORT_NUMBER
	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()