local filequeue = require 'filequeue'
local a = filequeue.open('./queue')
local b = a:new()
local f = b:open('wb')
f:write('test')
f:close()
b:queue()
a:stat()
