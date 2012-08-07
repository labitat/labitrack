./printloop.sh | tee /dev/stderr | (cd web && ./labitrackd.lua 0.0.0.0:8081 ../queue/)
