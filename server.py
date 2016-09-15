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
		if 'q' not in param or 'q' in param and param['q'][0] =='':
			self.wfile.write(json.dumps({
					"line": [
						"No",
						"Query"
					],
					"block": [
						"At",
						"All"
					]
				}))
		elif param['q'][0] =='a':
			self.wfile.write(json.dumps({
					"line": [
						"Input is a",
						"In lower case"
					],
					"block": [
						"Not b",
						"Not c either"
					]
				}))
		else:
			self.wfile.write(json.dumps({
					"line": [
						"First Line in Result",
						"Second Line in Result"
					],
					"block": [
						"This is supposed to be a HUGE chunk of data",
						"But it's not right now"
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