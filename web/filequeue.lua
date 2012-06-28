-- Lua 5.1+ filequeue module (c) 2011 by Asbjørn Sloth Tønnesen
-- licensed under the terms of the LGPL2
-- http://lua-users.org/wiki/Queue

-- usage:
-- local filequeue = require 'filequeue'
-- local a = filequeue:open('./queue')
-- local b = a:new()
-- local f = b:open()
-- b:queue()
-- a:stat()


local M = {}

local function random_str(len)
	-- intentionally not force seeded
	local i = len
	local ret = ''
	repeat
		local v = math.random(48,122)
		local flag = false
		if v <= 57 then
			flag = true
		elseif v <= 64 then
		elseif v <= 90 then
			flag = true
		elseif v <= 96 then
		elseif v <= 122 then
			flag = true
		end
		if flag then
			ret = ret .. string.char(v)
			i = i - 1
		end
	until i == 0
	return ret
end

local function get_filename()
	return os.time()..'.'..random_str(10);
end

local function ensure_dirs(basedir, dirs)
	local dirlen=#dirs
	local ret={}
	for i=1,dirlen do
		local path = basedir..'/'..dirs[i]
		os.execute("mkdir -p " .. path)
		ret[dirs[i]] = path
	end
	return ret
end

function M.open(basedir)
	local q = {}
	q.dirs = ensure_dirs(basedir, {'tmp', 'new'})
	q.new = function(q)
		local qi = {}
		qi.basename = get_filename(ext)
		qi.q = q
		qi.open = function(qi, flags)
			return io.open(qi.q.dirs['tmp']..'/'..qi.basename, flags)
		end
		qi.queue = function(qi)
			os.rename(qi.q.dirs['tmp']..'/'..qi.basename, qi.q.dirs['new']..'/'..qi.basename)
		end
		return qi
	end
	q.stat = function(q)
		local dirs = q.dirs
		local s = {}
		for id, path in pairs(dirs) do
			local cmd = 'ls -- '..path
			local cnt = 0
			local oldest = nil
			for line in io.popen(cmd):lines() do
				if cnt == 0 then
					oldest = tonumber(string.sub(line, 1, string.find(line,'.',1,true)-1))
				end
				cnt = cnt + 1
			end
			s[id] = {count=cnt, oldest=oldest}
		end
		return s
	end
	q.empty = function(q)
		os.execute('rm '..q.dirs['new']..'/*')
		return q:stat()
	end
	return q
end

return M
