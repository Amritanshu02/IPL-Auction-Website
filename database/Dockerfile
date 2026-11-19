FROM mongo:7.0

HEALTHCHECK --interval=5s --timeout=5s --start-period=20s --retries=12 \
    CMD ["mongosh", "--quiet", "--host", "127.0.0.1", "--eval", "quit(db.adminCommand({ ping: 1 }).ok === 1 ? 0 : 1)"]
