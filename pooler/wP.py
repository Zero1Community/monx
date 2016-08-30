import sys
import pika
import json
import signal
import httplib


connection = pika.BlockingConnection()
channel = connection.channel()

debug = 0

#def signal_handler(signal, frame):
#    print('Ctrl+C!')
#    sys.exit(0)
#signal.signal(signal.SIGINT, signal_handler)


def logger(level, _sensor_event):
  if(debug):
    print "[write_log] _sensor_event",level
    print "[write_log] Got log data: ",json.dumps(_sensor_event, indent=4, sort_keys=True)
  print _sensor_event
  #try:
  #  syslog.syslog(syslog.LOG_ERR, _sensor_event)
  #except:
  #  print "[write_log] Error while writing to syslog"


# TODO: port scan, ssl check, smtp, ping and other stuff like that
def processWork(tC):
  logger('info', tC)
  # if(tC.type === "blacklist"):
  #  monxBlacklist(tC)
  if(tC['type'] == "http_status"):
    monxHttpStatus(tC)
  # if(tC.type == "icmp_ping"){
  #   monxPing(tC)
  # if(tC.type == "api_route_check"):
  #   // kontrollo 3-4 URL ne grup te nje API sipas nje pathi
  # if(tC.type == "api_response_time"):
  #   //monxPing(tC)


def monxHttpStatus(httpStatObject):
  web_error = ""
  full_url = httpStatObject['host'].split("/")
  base_url = full_url[2]
  if ":" in base_url:
    service_port = base_url.split(":")[1] 
    base_url = base_url.split(":")[0]
  else:
    service_port = 80

  part_nr = 0
  part_url = ""
  #print "Splitting Url "
  for piece in full_url:
    part_nr+=1
    if(part_nr > 3):
      part_url += "/" + piece
  r = httplib.HTTPConnection(base_url, service_port, timeout=10)
  try:
    r.request("GET",part_url)
    response = r.getresponse()
  except:
    e = sys.exc_info()[0]
    #print e
    web_error = "Error Unable to connect to " + str(e)
    #print web_error
    logger('info', "ERROR " + str(web_error))
  if not web_error:
    #print response.status, response.reason
    logger('info' , "OK " + str(response.status) + " " +  response.reason )


for method_frame, properties, body in channel.consume('service_checks'):
    processWork(json.loads(body))
    channel.basic_ack(method_frame.delivery_tag)

    # Escape out of the loop after 10 messages
    #if method_frame.delivery_tag == 10:
    #    break

# Cancel the consumer and return any pending messages
requeued_messages = channel.cancel()
print 'Requeued %i messages' % requeued_messages
connection.close()