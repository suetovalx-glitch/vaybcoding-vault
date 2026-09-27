# Отчёт SSH-подключения к test-VPS

**Дата проверки:** 2026-09-26

| VPS | IP | Статус | Примечание |
| ----- | ----- | -------- | ------------ |
| test-1 (Stage-pi) | 78.17.67.159 | [OK] OK | Работает |
| test-2 (Stage-Hermes) | 31.77.192.54 | [OK] OK | Работает |
| test-3 (Stage-Infra) | 168.113.157.93 | [OK] OK | Работает |

## Детали

### test-1 (Stage-pi) (78.17.67.159)

Статус: OK

```
sotaserver.com
---
root
---
PRETTY_NAME="Ubuntu 24.04 LTS"
---
 09:44:51 up 1 day, 4 min,  1 user,  load average: 0.00, 0.00, 0.00
---
/dev/vda1        30G  3.7G   25G  14% /
---
Mem:           3.8Gi       498Mi       1.3Gi       3.1Mi       2.3Gi       3.3Gi
---
DOCKER: NOT FOUND
---
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.7
```

### test-2 (Stage-Hermes) (31.77.192.54)

Статус: OK

```
vm1950834.vds.as210546.net
---
root
---
PRETTY_NAME="Ubuntu 24.04.4 LTS"
---
 11:44:55 up 23:50,  1 user,  load average: 0.00, 0.00, 0.00
---
/dev/vda2        59G  3.7G   53G   7% /
---
Mem:           3.8Gi       481Mi       1.8Gi       2.5Mi       1.8Gi       3.4Gi
---
DOCKER: NOT FOUND
---
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.10
```

### test-3 (Stage-Infra) (168.113.157.93)

Статус: OK

```
132290.com
---
root
---
PRETTY_NAME="Ubuntu 24.04 LTS"
---
 09:44:56 up 19:39,  1 user,  load average: 0.00, 0.00, 0.00
---
/dev/vda1        79G  3.7G   72G   5% /
---
Mem:           7.8Gi       528Mi       4.5Gi       2.6Mi       3.0Gi       7.2Gi
---
DOCKER: NOT FOUND
---
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.7
```
