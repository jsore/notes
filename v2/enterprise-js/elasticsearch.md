# Elasticsearch

To be used to persist user data

- Distributed DB
- Full-text search engine
  + Basically an abstraction of Apacche Lucene search engine
- Analytics engine
- __New__: Security update for v6.8.0+ and 7.1.0+
  + https://www.elastic.co/blog/security-for-elasticsearch-is-now-free
  + TLS
  + File & native realm for user creation and management
  + Role-based user access to cluster API and Indices
  + Multi-tenancy for Kibana
  + Kubernetes support launched ( Elastic Cloud on Kuberneters, ECK )
  + SSO & LDAP access still Gold-only features


<br><br>



--------------------------------------------------------------------------------
### Development DB: Install Java + Elasticsearch

Install Java

Apache Lucene and Elasticsearch are Java-based, we want Javascript interaction
with it.

Two types of Java installs:

1. Java Runtime Environment ( __JRE__ )
    > run Java programs

2. Java Development Kit ( __JDK__ )
    > JRE + others to develop in Java

We need the JDK, macOS Java SE 8u212 ( jdk-8uversion-macosx-amd64.dmg )
https://docs.oracle.com/javase/8/docs/technotes/guides/install/mac_jdk.html#CHDBADCG

```
1. select the DL
    https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
2. accept the terms
3. ( oh for fucks sake ) create an Oracle account after clicking DL link
4. verify the account via email
5. go back to DL page
6. re-accept the terms
7. re-click the DL link
8. sign the hell into your new Oracle account
9. DMG downloads, install the pkg
10. verify install ( $ java -version )
```

Book goes on to say that my path needs to be udpated, for Ubuntu:

> Open:  /etc/environment
> add:  JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
> source:  $ . /etc/environment
> confirm:  $ echo $JAVA_HOME

For OSX ( found from Brew install instructions )

```
# verify jdk name first
$ ls /Library/Java/JavaVirtualMachines
> jdk<version>.jdk
$ echo 'export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_212.jdk/Contents/Home' >> ~/.bash_profile
$ source ~/.bash_profile
```

<br>


Install Elasticsearch

```
$ brew install elasticsearch
```

Add it to your path

```
$ echo 'export PATH="/usr/local/opt/elasticsearch/bin:$PATH"' >> ~/.bash_profile
$ source ~/.bash_profile
```

Run, or run in background at boot with brew
```
$ elasticsearch
$ brew services start elasticsearch
```

Test it
```
$ curl 'http://localhost:9200/?pretty'
```

Book says to add to Elasticsearch Java path to `/etc/default/elasticsearch`
```
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

But Elasticsearch was running when tested, so I'm not touching that for now.

<br><br>



--------------------------------------------------------------------------------
### Elasticsearch Concepts

Every document is uniquely identified by four attributes:

1. Index: store related documents here ( ~ database in relational DB )
2. Type: the kind of documents in an index ( ~ table )
3. ID: key
4. Version: increment on change, for concurrent updates and optimistic locking

Example:
```
Index: directory
  Type: person
    ID: xyz, Version: 1
    ID: abc, Version: 3
    ...
  Type: company
    ID: lmnop, Version: 5
    ID: cvs, Version: 2
```

<br><br>



--------------------------------------------------------------------------------

### Run Tests In Test Database

Test DB: `test`

Dev DB: `hobnob`

Revise test:e2e script and restart API with
```
npx dotenv -e test.env yarn run watch
```

Update environment variable files and run servers concurrently to avoid stopping
the API and restarting using a different environment setting

```
# the testing API server
$ npx dotenv -e envs/test.env yarn run watch
# the development API server
$ yarn run watch
```

<br><br>



--------------------------------------------------------------------------------

### Automate Testing

Instead of having to make sure Elasticsearch instance is running and that the
testing environment is loaded with `dotenv-cli` then run the API server, then
also having to put those instructions somewhere for developers using the tool,
squish it into a single command

From new directory `scripts` add the bash script and make it executable
```
$ mkdir scripts && touch scripts/e2e.test.sh && chmod +x scripts/e2e.test.sh
```

And update `scripts` from
```
"test:e2e": "dotenv -e envs/test.env -e envs/.env cucumber-js -- spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps",
```
To
```
"test:e2e": "dotenv -e envs/test.env -e envs/.env ./scripts/e2e.test.sh",
```
