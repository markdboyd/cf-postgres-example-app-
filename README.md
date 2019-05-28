# Example postgres Application

This simple application illustrates the use of the Postgres data service in a NodeJS application running on Cloud Foundry.

## Installation

#### Create a Postgres service instance

Find your Postgres service via `cf marketplace`.

```
$ cf marketplace
Getting services from marketplace in org testing / space testing as me...
OK

service             plans     description
postgres-cluster    Default   [Cluster] A PostgreSQL database on demand.
```

Our service is called `postgres-cluster`.  To create an instance of this service, use:

```
$ cf create-service postgres-cluster Default postgres-instance
```

#### Push the Example Application

The example application comes with a Cloud Foundry `manifest.yml` file, which provides all of the defaults necessary for an easy `cf push`.

```
$ cf push
Using manifest file cf-postgres-example-app/manifest.yml

Creating app postgres-example-app in org testing / space testing as me...
OK

Using route postgres-example-app.example.com
Binding posgres-example-app.example.com to postgres-example-app...
OK

Uploading postgres-example-app...
Uploading from: cf-postgres-example-app
...
Showing health and status for app postgres-example-app in org testing / space testing as me...
OK

requested state: started
instances: 0/1
usage: 256M x 1 instances
urls: postgres-example-app.10.244.0.34.xip.io

     state     since                    cpu    memory          disk
#0   running   2017-10-31 01:42:43 PM   0.0%   75.5M of 256M   0 of 1G
```

If you now curl the application, you'll see that the application has detected that it's not bound to a postgres instance.

```
$ curl http://postgres-example-app.example.com/

      You must bind a postrgres service instance to this application.

      You can run the following commands to create an instance and bind to it:

        $ cf create-service postgres-cluster Default postgres-instance
        $ cf bind-service postgres-example-app postgres-instance
```

#### Bind the Instance

Now, simply bind the postgres instance to our application.

```
$ cf bind-service postgres-example-app postgres-instance
Binding service postgres-instance to app postgres-example-app in org testing / space testing as me...
OK
TIP: Use 'cf restage' to ensure your env variable changes take effect
$ cf restage
```
